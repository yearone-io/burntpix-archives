"use client";
import styles from "../app/page.module.css";
import "../app/globals.css";
import {
  Box,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Link,
  Text,
  useToast,
} from "@chakra-ui/react";
import { New_Rocker } from "next/font/google";
import BurntPixArt from "@/components/BurntPixArt";
import Archives, { IArchive, IFetchArchives } from "@/components/Archives";
import WalletConnector from "@/components/wallet/WalletConnector";
import Article from "@/components/Article";
import MainStatsList, { StatsItem } from "@/components/MainStatsList";
import RefineButton from "@/components/RefineButton";
import Leaderboard from "@/components/Leaderboard";
import EditorsNote from "@/components/EditorsNote";
import { FaExternalLinkAlt } from "react-icons/fa";
import { inter } from "@/app/fonts";
import { BurntPixArchives__factory } from "@/contracts";
import { useContext, useEffect, useState, useCallback } from "react";
import { WalletContext } from "@/components/wallet/WalletContext";
import { divideBigIntTokenBalance } from "@/utils/numberUtils";
import YourContributions from "@/components/YourContributions";
import { hexToText, numberToBytes32 } from "@/utils/hexUtils";
import { getProfileData } from "@/utils/universalProfile";
import { constants } from "@/constants/constants";
import { Metadata } from "next";

const newRockerFont = New_Rocker({
  weight: ["400"],
  subsets: ["latin"],
});

export default function Home() {
  const walletContext = useContext(WalletContext);
  const { account, networkConfig, provider } = walletContext;
  const toast = useToast();

  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const burntPixArchives = BurntPixArchives__factory.connect(
    networkConfig.burntPixArchivesAddress,
    provider,
  );

  // immutables
  const [burntPicId, setBurntPicId] = useState<string>("");
  const [winnerIterations, setWinnerIterations] = useState<string>("--");
  const [supplyCap, setSupplyCap] = useState<number>(0);

  const [collectionStats, setCollectionStats] = useState<StatsItem[]>([
    { label: "Iterations:", value: "--" },
    { label: "Contributors:", value: "--" },
    { label: "Archive Mints:", value: "--" },
    { label: "LYX Burned:", value: "--" },
  ]);

  const archivesTitle = (
    <Box
      color="#FE005B"
      fontWeight={900}
      fontSize="md"
      lineHeight="17px"
      letterSpacing={1.5}
      fontFamily={inter.style.fontFamily}
    >
      ARCHIVES
      <Link isExternal={true} href={"/"}>
        <IconButton
          aria-label="View archives"
          color={"lukso.pink"}
          icon={<FaExternalLinkAlt />}
          size="sm"
          variant="ghost"
        />
      </Link>
    </Box>
  );

  const fetchCollectionStats = async () => {
    try {
      const [totalSupply, iterations, contributors, lyxBurned] =
        await Promise.all([
          burntPixArchives.totalSupply(),
          burntPixArchives.getTotalIterations(),
          burntPixArchives.getTotalContributors(),
          burntPixArchives.getTotalFeesBurnt(),
        ]);
      setCollectionStats([
        { label: "Iterations:", value: iterations.toString() },
        { label: "Contributors:", value: contributors.toString() },
        {
          label: "Archive Mints:",
          value: `${new Intl.NumberFormat("en-US").format(Number(totalSupply))} / ${new Intl.NumberFormat("en-US").format(supplyCap)}`,
        },
        {
          label: "LYX Burned:",
          value: `${divideBigIntTokenBalance(lyxBurned, 18).toString()} LYX`,
        },
      ]);
    } catch (error: any) {
      toast({
        title: `Failed to fetch collection stats: ${error.message}`,
        status: "error",
        position: "bottom-left",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const fetchImmutableStats = async () => {
      try {
        const [burntPicId, winnerIterations, supplyCap] = await Promise.all([
          burntPixArchives.burntPicId(),
          burntPixArchives.winnerIters(),
          burntPixArchives.tokenSupplyCap(),
        ]);
        setBurntPicId(burntPicId);
        setWinnerIterations(
          new Intl.NumberFormat("en-US").format(Number(winnerIterations)),
        );
        setSupplyCap(Number(supplyCap));
      } catch (error: any) {
        toast({
          title: `Failed to fetch collection constants: ${error.message}`,
          status: "error",
          position: "bottom-left",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchImmutableStats();
  }, []);

  useEffect(() => {
    supplyCap && fetchCollectionStats();
  }, [supplyCap]);

  const externalFetchArchives: IFetchArchives = useCallback(
    async (
      startFrom,
      amount,
      setArchives,
      setLoadedIndices,
      ownerProfiles,
      setOwnerProfiles,
    ) => {
      try {
        const archiveCount = await burntPixArchives.archiveCount();
        const count = Number(archiveCount);
        const end = Math.min(startFrom + amount, count);
        const newArchives: IArchive[] = [];

        for (let i = startFrom; i < end; i++) {
          const id = numberToBytes32(i + 1);
          const archive = await burntPixArchives.burntArchives(id);
          let isMinted = false;
          let ownerAddress = archive.creator;

          try {
            ownerAddress = await burntPixArchives.tokenOwnerOf(id);
            isMinted = true;
          } catch (error) {
            console.log(`archive ${id} not minted yet or error fetching owner`);
          }

          let ownerProfile = ownerProfiles[ownerAddress];
          if (!ownerProfile) {
            // Check if the profile is not already fetched
            try {
              ownerProfile = await getProfileData(
                ownerAddress,
                networkConfig.rpcUrl,
              );
            } catch (error: any) {
              ownerProfile = { name: "EOA" };
            }
            setOwnerProfiles((prevProfiles) => ({
              ...prevProfiles,
              [ownerAddress]: ownerProfile,
            }));
          }
          let ownerAvatar;

          if (ownerProfile.profileImage && ownerProfile.profileImage.length) {
            ownerAvatar = `${constants.IPFS_GATEWAY}/${ownerProfile.profileImage[0].url.replace("ipfs://", "")}`;
          }

          newArchives.push({
            id,
            image: hexToText(archive.image),
            ownerAddress,
            ownerName: ownerProfile.name,
            ownerAvatar,
            isMinted,
          });
        }

        setArchives((prevArchives) => [
          ...(Array.isArray(prevArchives) ? prevArchives : []),
          ...newArchives,
        ]);
        setLoadedIndices(end);
      } catch (error: any) {
        toast({
          title: `Failed to fetch archives: ${error.message}`,
          status: "error",
          position: "bottom-left",
          duration: 5000,
          isClosable: true,
        });
      }
    },
    [
      /* dependencies */
    ],
  );

  return (
    <main className={styles.main}>
      <Flex width="100%" direction={"column"} maxW={"2000px"} p={"0px 25px"}>
        <header>
          <Flex
            flexDir={{
              base: "column",
              md: "row",
            }}
            justifyContent="center"
            alignItems="center"
            width={"100%"}
          >
            <Flex flex="1" justifyContent="flex-end"></Flex>
            <Flex
              flex="2"
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Heading
                as="h1"
                fontFamily={newRockerFont.style.fontFamily}
                m="0"
                p="0"
              >
                Burnt Pix
                <br />
                {"   Archives"}
              </Heading>
              <Heading fontSize="m" as="h3" m="0" p="0">
                ON THE{" "}
                <Heading fontSize="m" as="span" color="lukso.pink">
                  LUKSO
                </Heading>{" "}
                CHAIN
              </Heading>
            </Flex>
            <Flex flex="1" justifyContent="flex-end">
              <Box>
                <WalletConnector />
              </Box>
            </Flex>
          </Flex>
        </header>
        <Box mt={4} pl={"20px"} pr={"20px"} width={"100%"}>
          <Box width="100%">
            <Divider mb={2} borderColor={"#000000"} opacity={1} />
            <Flex justifyContent="center" alignItems="center" w="100%">
              <Box flex="1" textAlign="left" pl={"20px"}>
                <Text color="#000000" fontWeight="400">
                  "All the Pixels, That Are Fit To Burn"
                </Text>
              </Box>
              <Box flex="0" minWidth="max-content" px={5}>
                <Text as="b">{formattedDate}</Text>
              </Box>
              <Box flex="1" textAlign="right" pr={"20px"}>
                <Text color="#000000" fontWeight="400">
                  {`To Unlock Original Contribute: ${winnerIterations} Iterations`}
                </Text>
              </Box>
            </Flex>
            <Divider opacity={1} borderColor={"#00000"} size={"lg"} />
          </Box>
          <Grid
            width={"100%"}
            mt="20px"
            templateColumns={{ base: "4fr 9fr", md: "9fr 4fr" }}
          >
            <GridItem
              borderRight={{ base: "none", md: "1px solid #000000" }}
              pb="20px"
            >
              <Flex direction={{ base: "column", md: "row" }}>
                <Box flex="1" minW={"300px"}>
                  <Article
                    title="LIVE VIEW"
                    description="In a First, LUKSO Community Works to Refine and Archive the Same Burnt Pic Together"
                  >
                    <Box p="20px 10%" w="100%">
                      <MainStatsList stats={collectionStats} />
                    </Box>
                    <RefineButton />
                  </Article>
                </Box>
                <Flex
                  flex="1"
                  minW="fit-content"
                  mt={{ base: 4, md: 0 }}
                  justifyContent="center"
                >
                  <BurntPixArt burntPicId={burntPicId} />
                </Flex>
              </Flex>
            </GridItem>
            <GridItem>
              <EditorsNote />
            </GridItem>
          </Grid>
          <Divider borderColor={"#00000"} size={"md"} />
          <Grid width={"100%"} templateColumns={{ base: "1fr", md: "9fr 4fr" }}>
            <GridItem w="100%" overflow={"hidden"}>
              <Flex
                flexDir="column"
                borderRight={{ base: "none", md: "1px solid #000000" }}
              >
                <Box>
                  <Article title={archivesTitle}>
                    <Archives fetchArchives={externalFetchArchives} />
                  </Article>
                </Box>
                <Divider borderColor={"#00000"} size={"md"} />
                <Article title="LEADERBOARD">
                  <Leaderboard />
                </Article>
              </Flex>
            </GridItem>
            <GridItem w="100%" overflow={"hidden"}>
              <YourContributions
                account={account}
                burntPixArchives={burntPixArchives}
              />
            </GridItem>
          </Grid>
        </Box>
      </Flex>
    </main>
  );
}
