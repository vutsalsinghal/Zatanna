import React from 'react';
import { Menu, Modal, Icon } from 'semantic-ui-react';
import {Link} from 'react-router-dom';

export default () => {
  return (
    <Menu style={{ marginTop:'10px' }}>
      <Menu.Item><Link to='/'>Zatanna</Link></Menu.Item>

      <Menu.Menu position="right">
        <Menu.Item><Link to='/someLink'><Icon name='rain' />Some Link</Link></Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};