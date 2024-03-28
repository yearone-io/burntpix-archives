import React from 'react';
import { List, ListItem, ListIcon, Box } from '@chakra-ui/react';
import { MdLens } from 'react-icons/md'; // This is an example icon from 'react-icons'

interface StatsListProps {
  iterations: number;
  contributors: number;
  totalArchives: number;
  totalMints: number
  lyxBurned: number;
}

const MainStatsList: React.FC<StatsListProps> = ({
  iterations,
  contributors,
  totalArchives,
  totalMints,
  lyxBurned,
}) => {
  // Define color for the bullet points
  const bulletColor = '#FE005B';

  return (
    <Box>
      <List spacing={3}>
        <ListItem>
          <ListIcon as={MdLens} color={bulletColor} />
          Iterations: {iterations.toLocaleString()}
        </ListItem>
        <ListItem>
          <ListIcon as={MdLens} color={bulletColor} />
          Contributors: {contributors}
        </ListItem>
        <ListItem>
          <ListIcon as={MdLens} color={bulletColor} />
          Archive Mints: {totalArchives} / {totalMints}
        </ListItem>
        <ListItem>
          <ListIcon as={MdLens} color={bulletColor} />
          LYX Burned: {lyxBurned} LYX
        </ListItem>
      </List>
    </Box>
  );
};

export default MainStatsList;
