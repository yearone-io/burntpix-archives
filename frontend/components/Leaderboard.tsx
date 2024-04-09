import React, { useContext, useEffect, useState } from "react";
import { Box, Avatar, Flex, Text, Skeleton, useToast } from "@chakra-ui/react";
import { inter } from "@/app/fonts"; // Make sure this import path is correct
import { BurntPixArchives__factory } from "@/contracts";
import { WalletContext } from "./wallet/WalletContext";
import { getProfileData } from "@/utils/universalProfile";
import { constants } from "@/constants/constants";
import { ZeroAddress } from "ethers";
import { formatAddress } from "@/utils/tokenUtils";

interface Contribution {
  contributor: string;
  contribution: number;
  upName: string | null;
  avatar: string | null;
}

const Leaderboard: React.FC = () => {
  const walletContext = useContext(WalletContext);
  const toast = useToast();
  const { networkConfig, provider, refineEventCounter } = walletContext;
  const [topContributions, setTopContributions] = useState<Contribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const truncateName = (name: string) => {
    if (name.length > 25) {
      return name.substring(0, 25) + "...";
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
        if (Number(contributions[0]) === 0) {
          return;
        }

        const profiles = await Promise.all(
          topContributors.map((contrib) =>
            fetchProfileData(contrib, networkConfig.rpcUrl),
          ),
        );
        const contributionsWithProfiles = topContributors
          .filter((contributor) => contributor !== ZeroAddress)
          .map((contributor, index) => ({
            contributor,
            contribution: Number(contributions[index]),
            upName: profiles[index]?.upName || null,
            avatar: profiles[index]?.avatar || null,
          }));

        setTopContributions(contributionsWithProfiles);
      } catch (error: any) {
        toast({
          title: `Failed to fetch leaderboard contributions: ${error.message}`,
          status: "error",
          position: "bottom-left",
          duration: null,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchContributions();
  }, [refineEventCounter]); // NOTE: adding dependencies will cause duplicated calls

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
  const avatarSize = { base: "18px", md: "24px" };
  const fontSizing = { base: "sm", md: "md", lg: "lg" };
  const renderItem = (item: Contribution, index: number) => {
    const contributorName = item.upName
      ? truncateName(item.upName)
      : formatAddress(item.contributor);
    return (
      <Flex
        key={index}
        alignItems="center"
        justifyContent="space-between"
        p={0.5}
      >
        <Flex alignItems="center" flex="1" gap={3}>
          <Text
            fontSize={fontSizing}
            fontWeight="normal"
            minWidth="20px"
            fontFamily={inter.style.fontFamily}
          >
            {index + 1}.
          </Text>
          <Flex alignItems={"center"} gap={2}>
            {item.avatar !== null && (
              <Avatar
                src={item.avatar}
                height={avatarSize}
                width={avatarSize}
              />
            )}
            <Text
              fontSize={fontSizing}
              fontWeight="normal"
              flex="1"
              fontFamily={inter.style.fontFamily}
            >
              {contributorName}
            </Text>
          </Flex>
        </Flex>
        <Text fontSize={fontSizing} fontWeight="800">
          {item.contribution.toLocaleString()}
        </Text>
      </Flex>
    );
  };

  return topContributions.length || isLoading ? (
    <Flex
      direction={{ base: "column", md: "row" }}
      wrap="wrap"
      justifyContent="center"
      alignItems={"center"}
      w="100%"
    >
      {isLoading ? (
        <>
          <Box minWidth={{ base: "100%", md: "50%" }}>
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} height="30px" width="100%" />
            ))}
          </Box>
          <Box minWidth={{ base: "100%", md: "50%" }}>
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} height="30px" width="100%" />
            ))}
          </Box>
        </>
      ) : (
        <>
          <Box minWidth={{ base: "100%", md: "50%" }}>
            {topContributions.slice(0, 5).map(renderItem)}
          </Box>
          {topContributions.slice(5, 10).length ? (
            <Box minWidth={{ base: "100%", md: "50%" }}>
              {topContributions.slice(5, 10).map(renderItem)}
            </Box>
          ) : null}
        </>
      )}
    </Flex>
  ) : (
    <Flex
      height={"120px"}
      alignItems={"center"}
      justifyContent={"center"}
      w="100%"
      px={7}
      gap={3}
    >
      <Text fontSize={"lg"} lineHeight={"lg"} fontWeight={400}>
        Leaderboard is empty
      </Text>
      <Text fontSize={"3xl"} lineHeight={"3xl"}>
        🏆
      </Text>
    </Flex>
  );
};

export default Leaderboard;
