import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Flex,
  Text,
  Grid,
  useBreakpointValue,
  Skeleton,
  useToast,
} from "@chakra-ui/react";
import { inter } from "@/app/fonts"; // Make sure this import path is correct
import { BurntPixArchives__factory } from "@/contracts";
import { WalletContext } from "./wallet/WalletContext";
import { getProfileData } from "@/utils/universalProfile";
import { constants } from "@/constants/constants";

interface Contribution {
  contributor: string;
  contribution: number;
  upName: string | null;
  avatar: string | null;
}

const Leaderboard: React.FC = () => {
  const margin = useBreakpointValue({ base: "0", md: "20px" });
  const walletContext = useContext(WalletContext);
  const toast = useToast();
  const { networkConfig, provider } = walletContext;
  const [sortedContributions, setSortedContributions] = useState<
    Contribution[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const truncateName = (name: string) => {
    if (name.length > 10) {
      return name.substring(0, 10) + "...";
    }
    return name;
  };

  const burntPixArchives = BurntPixArchives__factory.connect(
    networkConfig.burntPixArchivesAddress,
    provider,
  );

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const [topContributors, contributions] =
          await burntPixArchives.getTopTenContributors();

        const profiles = await Promise.all(
          topContributors.map((contrib) =>
            fetchProfileData(contrib, networkConfig.rpcUrl),
          ),
        );
        const contributionsWithProfiles = topContributors.map(
          (contributor, index) => ({
            contributor,
            contribution: Number(contributions[index]),
            upName: profiles[index]?.upName || null,
            avatar: profiles[index]?.avatar || null,
          }),
        );

        setSortedContributions(contributionsWithProfiles);
      } catch (error: any) {
        toast({
          title: `Failed to fetch leaderboard contributions: ${error.message}`,
          status: "error",
          position: "bottom-left",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchContributions();
  }, []); // NOTE: adding dependencies will cause duplicated calls

  const fetchProfileData = async (
    contributor: string,
    rpcUrl: string,
  ): Promise<{ upName: string | null; avatar: string | null } | null> => {
    try {
      const profileData = await getProfileData(contributor, rpcUrl);
      let upName = null,
        avatar = null;

      if (profileData) {
        if (profileData.profileImage && profileData.profileImage.length > 0) {
          avatar = `${constants.IPFS_GATEWAY}/${profileData.profileImage[0].url.replace("ipfs://", "")}`;
        }
        upName = profileData.name;
      }

      return { upName, avatar };
    } catch (error) {
      console.error("Error fetching profile data for", contributor, error);
      return null;
    }
  };

  const renderItem = (item: Contribution, index: number) => (
    <Flex
      key={index}
      alignItems="center"
      justifyContent="space-between"
      p={0.5}
    >
      <Flex alignItems="center" flex="1">
        <Text
          fontSize="md"
          fontWeight="normal"
          minWidth="20px"
          mr="50px"
          fontFamily={inter.style.fontFamily}
        >
          {index + 1}.
        </Text>
        {item.avatar !== null && (
          <Avatar
            name={truncateName(item.upName || item.contributor)}
            src={item.avatar}
            height="16px"
            width="16px"
          />
        )}
        <Text
          fontSize="md"
          fontWeight="normal"
          ml="3"
          mr="50px"
          flex="1"
          fontFamily={inter.style.fontFamily}
          isTruncated // This ensures the name doesn't push the score out of view
        >
          {truncateName(item.upName || item.contributor)}
        </Text>
      </Flex>
      <Box textAlign="left" minW="80px">
        {" "}
        <Text fontSize="md" fontWeight="bold">
          {item.contribution.toLocaleString()}
        </Text>
      </Box>
    </Flex>
  );

  // Split the items into two columns
  const columnOneItems = sortedContributions.slice(0, 5);
  const columnTwoItems = sortedContributions.slice(5, 10);

  const gridTemplateColumns = { base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" };

  const loadingSkeleton = (
    <Grid templateColumns={gridTemplateColumns} gap="2" mr="20px">
      <Skeleton height="30px" width="100%" />
      <Skeleton height="30px" width="100%" />
      <Skeleton height="30px" width="100%" />
      <Skeleton height="30px" width="100%" />
      <Skeleton height="30px" width="100%" />
      <Skeleton height="30px" width="100%" />
      <Skeleton height="30px" width="100%" />
      <Skeleton height="30px" width="100%" />
      <Skeleton height="30px" width="100%" />
      <Skeleton height="30px" width="100%" />
    </Grid>
  );

  const gridItems = (
    <Grid templateColumns={gridTemplateColumns}>
      <Box mr="20px">{columnOneItems.map(renderItem)}</Box>
      <Box mr="20px">
        {columnTwoItems.map((item, index) => renderItem(item, index + 5))}
      </Box>
    </Grid>
  );

  return (
    <Box ml={margin} mr={margin} mt="20px" mb="20px" w="100%">
      {isLoading ? loadingSkeleton : gridItems}
    </Box>
  );
};

export default Leaderboard;
