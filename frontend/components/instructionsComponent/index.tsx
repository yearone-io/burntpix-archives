import styles from "./instructionsComponent.module.css";
import {New_Rocker} from "next/font/google";
import {Box, Divider, Flex, Heading, Text} from "@chakra-ui/react";

const newRockerFont = New_Rocker({
  weight: ['400'],
  subsets: ['latin'],
});


export default function InstructionsComponent() {
  const date = new Date();
  const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
        <div className={styles.header}>
          <Heading as={"h1"} fontFamily={newRockerFont.style.fontFamily}>Burnt Pix Archives</Heading>
          <Box pl={32}>
            <Heading fontSize={"m"} as={"h3"}>ON THE <Heading fontSize={"m"} as={"span"} color={"lukso.pink"}>LUKSO</Heading> CHAIN</Heading>
          </Box>
        </div>
      </header>

      <Box mt={4} pl={10} pr={10} width={"100%"}>
        <Divider mb={2} />
        <Flex>
          <Box flex="1">
            <Text pl={10}>
              All the Pixels, That Are Fit To Burn
            </Text>
          </Box>
          <Text as={"b"}>
            {formattedDate}
          </Text>
          <Text flex="1"></Text>
        </Flex>
        <Divider mt={2}/>
      </Box>
    </div>
  );
}
