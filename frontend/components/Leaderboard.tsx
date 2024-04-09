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
  const walletContext = useContext(WalletContext);
  const toast = useToast();
  const { networkConfig, provider, refineEventCounter } = walletContext;
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
    let isMounted = true;
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
    const fetchProfileDataWithDelay = async (contributors: string[], delayMs: number) => {
      const profiles = [];
      for (const contrib of contributors) {
        if (!isMounted) return;
        const profile = await fetchProfileData(contrib, networkConfig.rpcUrl);
        profiles.push(profile);
        await delay(delayMs);
      }
      return profiles;
    };
  
    const fetchContributions = async () => {
      setIsLoading(true);
      try {
        const [topContributors, contributions] = await burntPixArchives.getTopTenContributors();
        if (Number(contributions[0]) === 0 || !isMounted) {
          return;
        }
        const delayMsTime = 150
  
        const profiles = await fetchProfileDataWithDelay(topContributors, delayMsTime);
        if (!isMounted || !profiles) return;
  
        const contributionsWithProfiles = topContributors.map((contributor, index) => ({
          contributor,
          contribution: Number(contributions[index]),
          upName: profiles[index]?.upName || null,
          avatar: profiles[index]?.avatar || null,
        }));
  
        if (isMounted) setSortedContributions(contributionsWithProfiles);
      } catch (error: any) {
        if (isMounted) {
          toast({
            title: `Failed to fetch leaderboard contributions: ${error.message}`,
            status: "error",
            position: "bottom-left",
            duration: null,
            isClosable: true,
          });
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
  
    fetchContributions();
  
    return () => {
      isMounted = false;
    };
  }, [refineEventCounter]);
  

  const fetchProfileData = async (
    contributor: string,
    rpcUrl: string,
  ): Promise<{ upName: string | null; avatar: string | null } | null> => {
    try {

      if (contributor === "0x0000000000000000000000000000000000000000"
      ) {
        return { upName: null, avatar: null };
      }

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

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      wrap="wrap"
      justifyContent="center"
      w="100%"
    >
      <Box minWidth={{ base: "100%", md: "50%" }}>
        {isLoading
          ? [...Array(5)].map((_, index) => (
              <Skeleton key={index} height="30px" width="100%" />
            ))
          : sortedContributions.slice(0, 5).map(renderItem)}
      </Box>
      <Box minWidth={{ base: "100%", md: "50%" }}>
        {isLoading
          ? [...Array(5)].map((_, index) => (
              <Skeleton key={index + 5} height="30px" width="100%" />
            ))
          : sortedContributions.slice(5, 10).map(renderItem)}
      </Box>
    </Flex>
  );
};

export default Leaderboard;
