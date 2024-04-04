import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Flex,
  Text,
  Grid,
  useBreakpointValue,
  Skeleton,
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
    const fetchAllContributions = async () => {
      try {
        const contributors = await burntPixArchives.getContributors();
        console.log("Contributors", contributors);

        const rpcUrl = networkConfig.rpcUrl;
        const contributionsPromises = contributors.map((contributor) =>
          fetchContributionAndProfile(contributor, rpcUrl),
        );

        const allContributions = await Promise.all(contributionsPromises);
        const validContributions = allContributions.filter(
          (contribution): contribution is Contribution => contribution !== null,
        );
        validContributions.sort((a, b) => b.contribution - a.contribution);
        setSortedContributions(validContributions);
        console.log("Contributions", validContributions);
      } catch (error) {
        console.error("Error getting contributors", error);
        setIsLoading(false);
      }
    };

    fetchAllContributions().finally(() => setIsLoading(false));
  }, []);

  const fetchContributionAndProfile = async (
    contributor: string,
    rpcUrl: string,
  ): Promise<Contribution | null> => {
    try {
      const contributionBigInt =
        await burntPixArchives.contributions(contributor);
      const contribution = Number(contributionBigInt.toString());

      let upName = null;
      let avatar = null;
      try {
        const profileData = await getProfileData(contributor, rpcUrl);
        if (
          profileData &&
          profileData.profileImage &&
          profileData.profileImage.length > 0
        ) {
          avatar = `${constants.IPFS_GATEWAY}/${profileData.profileImage[0].url.replace("ipfs://", "")}`;
        }
        if (profileData && profileData.name) {
          upName = profileData.name;
        }
      } catch {
        // If the profile data is not available, we'll just use the contributor address
      }
      return {
        contributor,
        contribution,
        upName,
        avatar,
      };
    } catch (error) {
      console.error("Error fetching data for contributor", contributor, error);
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
        {/* Ensure a minimum width for alignment */}
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