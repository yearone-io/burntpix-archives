import React, { useContext, useEffect, useState } from "react";
import { Avatar, Flex, Text, Skeleton, useToast } from "@chakra-ui/react";
import { inter } from "@/app/fonts"; // Make sure this import path is correct
import { BurntPixArchives__factory } from "@/contracts";
import { WalletContext } from "./wallet/WalletContext";
import { getProfileBasicInfo } from "@/utils/universalProfile";
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
    if (name.length > 20) {
      return name.substring(0, 20) + "...";
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
        let [topContributors, contributions] =
          await burntPixArchives.getTopTenContributors();
        if (Number(contributions[0]) === 0) {
          return;
        }
        const zeroContributionIndeces: number[] = [];
        contributions.forEach((contribution, index) => {
          if (Number(contribution) === 0) {
            zeroContributionIndeces.push(index);
          }
        });
        topContributors = topContributors.filter(
          (_, index) => !zeroContributionIndeces.includes(index),
        );
        contributions = contributions.filter(
          (_, index) => !zeroContributionIndeces.includes(index),
        );

        const profiles = await Promise.all(
          topContributors.map((contrib) =>
            getProfileBasicInfo(contrib, networkConfig.rpcUrl),
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
        <Flex alignItems="center" flex="1" gap={16}>
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

  // todo: rework this as a grid
  return topContributions.length || isLoading ? (
    <Flex
      direction={{ base: "column", md: "row" }}
      wrap="wrap"
      justifyContent="center"
      alignItems={"flex-start"}
      w="100%"
    >
      {isLoading ? (
        <>
          <Flex
            flexDir={"column"}
            marginRight={{ base: "0", md: "10%" }}
            minWidth={{ base: "100%", md: "45%" }}
            gap={3}
            mr={"5%"}
          >
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} height="30px" width="100%" />
            ))}
          </Flex>
          <Flex
            flexDir={"column"}
            minWidth={{ base: "100%", md: "45%" }}
            gap={3}
          >
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} height="30px" width="100%" />
            ))}
          </Flex>
        </>
      ) : (
        <>
          <Flex
            flexDir={"column"}
            marginRight={{ base: "0", md: "10%" }}
            minWidth={{ base: "100%", md: "45%" }}
            gap={3}
          >
            {topContributions.slice(0, 5).map(renderItem)}
          </Flex>
          {topContributions.slice(5, 10).length ? (
            <Flex
              flexDir={"column"}
              minWidth={{ base: "100%", md: "45%" }}
              gap={3}
            >
              {topContributions
                .slice(5, 10)
                .map((item, index) => renderItem(item, index + 5))}
            </Flex>
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
