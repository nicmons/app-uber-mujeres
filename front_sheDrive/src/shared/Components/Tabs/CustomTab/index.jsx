import { useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Box } from '@mui/material';

function CustomTab({ tabs, defaultTab, onChange }) {
  const [activeTab, setActiveTab] = useState(defaultTab || 0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={activeTab} onChange={handleTabChange}>
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>
    </Box>
  );
}

CustomTab.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  defaultTab: PropTypes.number,
  onChange: PropTypes.func,
};

export default CustomTab;
