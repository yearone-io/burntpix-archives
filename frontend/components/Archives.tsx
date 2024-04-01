import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  FaArrowCircleLeft,
  FaExternalLinkAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { FaArrowCircleRight } from "react-icons/fa";
import { BurntPixArchives__factory } from "@/contracts";
import { WalletContext } from "@/components/wallet/WalletContext";

function numberToBytes32(num: number): string {
  // Convert the number to a hex string
  let hexString = num.toString(16);

  // Pad the hex string with zeros to ensure it is 64 characters long
  hexString = hexString.padStart(64, "0");

  // Prepend '0x' to denote a hex value
  return "0x" + hexString;
}

function hexToText(hexString: string): string {
  // Remove the '0x' prefix if present
  if (hexString.startsWith("0x")) {
    hexString = hexString.slice(2);
  }

  // Convert the hex string to a Buffer, then to a UTF-8 string
  const text = Buffer.from(hexString, "hex").toString("utf8");
  return text;
}

const Archives = ({ images }: { images: string[] }) => {
  const walletContext = useContext(WalletContext);
  const { networkConfig, provider } = walletContext;
  const [archives, setArchives] = useState<string[]>([]);
  const [startIndex, setStartIndex] = useState(0);

  const nextSlide = () => {
    setStartIndex((prevIndex) => Math.min(prevIndex + 5, images.length - 1));
  };

  const prevSlide = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - 5, 0));
  };

  const burntPixArchives = BurntPixArchives__factory.connect(
    networkConfig.burntPixArchivesAddress,
    provider,
  );

  useEffect(() => {
    burntPixArchives
      .archiveCount()
      .then((value) => {
        console.log("archives", Number(value));
        return Number(value);
      })
      .then((value) => {
        return Promise.all(
          Array.from({ length: value }, (_, i) => {
            const id = numberToBytes32(i + 1);
            console.log("id", id);
            return burntPixArchives.burntArchives(id);
          }),
        );
      })
      .then((value) => {
        const fetchedArchives: string[] = [];
        value.map((archive) => {
          fetchedArchives.push(hexToText(archive.image));
        });
        setArchives(fetchedArchives);
      })
      .catch((reason) => {
        console.error("Error fetching archives", reason);
      });
  }, []);

  return (
    <VStack alignItems={"left"}>
      <HStack>
        <Text color={"lukso.pink"} fontSize={"lg"} fontWeight={"900"}>
          ARCHIVES
        </Text>
        <Link isExternal={true} href={"/"}>
          <IconButton
            aria-label="View archives"
            color={"lukso.pink"}
            icon={<FaExternalLinkAlt />}
            size="sm"
            variant="ghost"
          />
        </Link>
      </HStack>
      <HStack>
        <IconButton
          icon={<FaArrowCircleLeft />}
          onClick={prevSlide}
          aria-label={"Previous"}
        ></IconButton>
        <Flex>
          {archives.slice(startIndex, startIndex + 5).map((image, index) => (
            <VStack alignItems={"left"} key={index}>
              <div
                style={{ height: "115px", width: "115px" }}
                dangerouslySetInnerHTML={{ __html: image }}
              />
              <Flex>
                <Text color={"black"} fontWeight={"500"}>
                  #{index + startIndex + 1}
                </Text>
                <Spacer />
                <Avatar height={"24px"} width={"24px"} />
                <Icon ml={1} as={FaCheckCircle} boxSize={"24px"} />
              </Flex>
            </VStack>
          ))}
        </Flex>
        <IconButton
          onClick={nextSlide}
          icon={<FaArrowCircleRight />}
          aria-label={"Next"}
        ></IconButton>
      </HStack>
    </VStack>
  );
};

export default Archives;
