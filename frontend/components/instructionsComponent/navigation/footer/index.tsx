import React from 'react';
import { Box, Flex, Text, Link, IconButton } from '@chakra-ui/react';
import { ExternalLinkIcon, } from '@chakra-ui/icons';
import { inter } from "@/app/fonts";
import { FaSquareGithub } from "react-icons/fa6";

const Footer: React.FC = () => {
  return (
    <Box as="footer" w="full">
      <Flex
        alignItems="center"
        justifyContent="space-between"
        p={4}
        borderTop="1px"
        borderColor="#000000"
      >
        {/* Left side: Lukso Mainnet and SC */}
        <Flex alignItems="center">
          {/* <LuksoMainnetComponent /> This is your existing component */}
          <Text 
              fontSize="14px"
              fontFamily={inter.style.fontFamily}
              lineHeight='17px'
              fontWeight={400}
              letterSpacing={1.5}
          >SC: 0xd4E...Fa2</Text>
          <Link href="#" isExternal ml='10px' size="14px">
            <ExternalLinkIcon 
                          
                          />
          </Link>
          <Link href="https://github.com/yearone-io/burntpix-archives" isExternal ml='10px'>
            <IconButton
              aria-label="More info"
              icon={<FaSquareGithub />}
              variant="ghost"
              size="21px"
            />
          </Link>

        </Flex>

        {/* Right side: Built by */}
        <Text
          fontSize="10px"
          fontFamily={inter.style.fontFamily}
          lineHeight='12px'
          fontWeight={500}
          letterSpacing={1.5}
        >built by
        <Link
          href="https://twitter.com/YearOneIO"
          textDecoration="underline"
          target="blank"
        >
        @yearoneio
        </Link>            
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;
