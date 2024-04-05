import React, { useContext, useEffect, useState } from "react";
import { Grid, Box, Text, List, ListItem } from "@chakra-ui/react";
import { MdLens } from "react-icons/md";
import { inter } from "@/app/fonts";
import { divideBigIntTokenBalance } from "@/utils/numberUtils";
import { WalletContext } from "@/components/wallet/WalletContext";
import { BurntPixArchives__factory } from "@/contracts";

const MainStatsList: React.FC = () => {
  const bulletColor = "#FE005B";
  const walletContext = useContext(WalletContext);
  const { networkConfig, provider } = walletContext;

  const burntPixArchives = BurntPixArchives__factory.connect(
    networkConfig.burntPixArchivesAddress,
    provider,
  );
  const [iterations, setIterations] = useState<string>("--");
  const [contributors, setContributors] = useState<string>("--");
  const [archiveMints, setArchiveMints] = useState<string>("--");
  const [lyxBurned, setLyxBurned] = useState<string>("--");

  const stats = [
    { label: "Iterations:", value: iterations },
    { label: "Contributors:", value: contributors },
    { label: "Archive Mints::", value: archiveMints },
    { label: "LYX Burned:", value: lyxBurned },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      const iterations = await burntPixArchives.getTotalIterations();
      const contributors = await burntPixArchives.getTotalContributors();
      const totalSupply = await burntPixArchives.totalSupply();
      const supplyCap = await burntPixArchives.tokenSupplyCap();
      const lyxBurned = await burntPixArchives.getTotalFeesBurnt();

      setIterations(iterations.toString());
      setContributors(contributors.toString());
      setArchiveMints(`${totalSupply.toString()} / ${supplyCap.toString()}`);
      setLyxBurned(`${divideBigIntTokenBalance(lyxBurned, 18).toString()} LYX`);
    };

    fetchStats();
  }, []);

  return (
    <Box p="20px 10%" w="100%">
      <List spacing={1}>
        {stats.map((item, index) => (
          <ListItem key={index}>
            {/* Setting up the grid with two columns: one for the label and icon, another for the value */}
            <Grid templateColumns="repeat(2, 1fr)" alignItems="center" gap={2}>
              <Box display="flex" alignItems="center">
                <Box as={MdLens} color={bulletColor} mr="2" size="9px" />
                <Text
                  as="span"
                  fontWeight="500"
                  fontSize="16px"
                  lineHeight="26px"
                  fontFamily={inter.style.fontFamily}
                  letterSpacing="1.5"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {item.label}
                </Text>
              </Box>
              <Text
                as="span"
                textAlign="right"
                fontWeight="800"
                fontSize="16px"
                lineHeight="26px"
                fontFamily={inter.style.fontFamily}
                letterSpacing="1.5"
              >
                {item.value}
              </Text>
            </Grid>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default MainStatsList;
