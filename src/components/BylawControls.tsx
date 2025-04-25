import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Switch,
  Divider,
} from '@mui/material';
import { RootState } from '../store';
import { toggleBylaw } from '../store/bylawsSlice';
import { ActiveBylaws } from '../types/bylaws';

const bylawCategories = [
  {
    name: 'frontSetback',
    label: 'Front Setback',
    description: '5.0m minimum from front property line',
  },
  {
    name: 'rearSetback',
    label: 'Rear Setback',
    description: '7.5m minimum from rear property line',
  },
  {
    name: 'sideSetback',
    label: 'Side Setback',
    description: '0.9m minimum from side property lines',
  },
  {
    name: 'heightRestriction',
    label: 'Height Restriction',
    description: '10m maximum height, 7m main wall height',
  },
  {
    name: 'lotCoverage',
    label: 'Lot Coverage',
    description: '40% maximum lot coverage',
  },
  {
    name: 'buildingDepth',
    label: 'Building Depth',
    description: '17m maximum building depth',
  },
];

export const BylawControls = () => {
  const dispatch = useDispatch();
  const { active } = useSelector((state: RootState) => state.bylaws);

  const handleToggle = (bylaw: keyof ActiveBylaws) => {
    dispatch(toggleBylaw(bylaw));
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        width: 350,
        overflowY: 'auto',
        p: 2,
        backgroundColor: 'background.paper',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Toronto Bylaw Controls
      </Typography>
      <List>
        {bylawCategories.map((category) => (
          <Box key={category.name}>
            <ListItem>
              <ListItemText
                primary={category.label}
                secondary={category.description}
              />
              <Switch
                edge="end"
                checked={active[category.name as keyof ActiveBylaws]}
                onChange={() => handleToggle(category.name as keyof ActiveBylaws)}
              />
            </ListItem>
            <Divider />
          </Box>
        ))}
      </List>
    </Paper>
  );
}; 