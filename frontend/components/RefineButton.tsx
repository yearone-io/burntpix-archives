import React from 'react';
import { Button, Flex, Icon } from '@chakra-ui/react';
import { MdSettings } from 'react-icons/md';

const RefineButton: React.FC = () => {
  const buttonBgColor = '#FE005B';
  const buttonTextColor = 'white';
  const iconButtonSize = '24px';

  return (
    <Flex align="center" justify="right" gap="1" mt='15px'>
      <Button
        bg={buttonBgColor}
        color={buttonTextColor}
        _hover={{ bg: 'red.600' }}
        borderRadius={50}
      >
        REFINE
      </Button>

      <Button
        size="sm"
        variant="ghost"
        color={buttonBgColor}
        _hover={{ bg: 'red.200', color: 'red.700' }}
      >
        <Icon as={MdSettings} boxSize={iconButtonSize} />
      </Button>
    </Flex>
  );
};

export default RefineButton;
