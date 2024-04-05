import React, {useState, useEffect} from 'react';
import { Box, Flex, IconButton, Link} from '@chakra-ui/react';
import { FaExternalLinkAlt } from "react-icons/fa";
import { inter } from "@/app/fonts";
import { AddressLike } from 'ethers';
import Article from './Article';
import MainStatsList from './MainStatsList';
import Archives from './Archives';
import SignInBox from './SigninBox';
import { BurntPixArchives } from '@/contracts/BurntPixArchives';
import { getNextIterationsGoal } from '@/utils/burntPixUtils';

interface IYourContributionsProps {
    readonly account: string | null;
    readonly burntPixArchives: BurntPixArchives;
}

const YourContributions = ({account, burntPixArchives}: IYourContributionsProps) => {
  const [userIterations, setUserIterations] = useState<string>("--");
  const [userArchives, setUserArchives] = useState<string[]>([]);
  const [userOwnedArchiveMints, setUserOwnedArchiveMints] = useState<string[]>([]);
  const [userIterationsGoal, setUserIterationsGoal] = useState<string>("--");

  const userStats = [
    { label: "Iterations:", value: userIterations },
    { label: "Archive Unlocks:", value: userArchives.length },
    { label: "Archive Mints:", value: userOwnedArchiveMints.length },
    { label: "Iters Till Next Archive:", value: userIterationsGoal },
  ];

  const fetchUserStats = async (account: string) => {
    if (!account) return;
    const userIterations = await burntPixArchives.getContributions([account as AddressLike]);
    const userArchives = await burntPixArchives.getArchives(account);
    const userOwnedArchiveMints = await burntPixArchives.tokenIdsOf(account);
    const userIterationsGoal = getNextIterationsGoal(userArchives.length + 1, Number(userIterations[0]));

    setUserIterations(new Intl.NumberFormat('en-US').format(Number(userIterations)));
    setUserArchives(userArchives);
    setUserOwnedArchiveMints(userOwnedArchiveMints);
    setUserIterationsGoal(new Intl.NumberFormat('en-US').format(Number(userIterationsGoal)));
  }

  useEffect(() => {
    fetchUserStats(account as string);
  }, [account]);
    const yourArchivesTitle = (
        <Box
          color="#FE005B"
          fontWeight={900}
          fontSize="md"
          lineHeight="17px"
          letterSpacing={1.5}
          fontFamily={inter.style.fontFamily}
        >
          {" "}
          YOUR ARCHIVES
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

    return (
        <>
            {account ? (
                <Flex flexDir="column">
                  <Article title="YOUR CONTRIBUTIONS">
                    <Box p="20px 0px">
                      <MainStatsList stats={userStats} />
                    </Box>
                  </Article>
                  <Article title={yourArchivesTitle}>
                    <Archives />
                  </Article>
                </Flex>
              ) : (
                <Article title="YOUR CONTRIBUTIONS">
                  <Flex
                    height="100%"
                    w="100%"
                    alignContent="center"
                    justifyContent="center"
                  >
                    <SignInBox />
                  </Flex>
                </Article>
              )}
        </>
    );
};

export default YourContributions;
