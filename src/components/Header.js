import React from 'react';
import { Menu, Icon, Modal } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import SearchSong from './SearchSong';

export default () => {
  return (
    <Menu style={{ marginTop: '0px', }} size={'large'}>
      <Menu.Item><Link to='/'>Zatanna</Link></Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item><Link to='/songs'>Discover<Icon name='feed' /></Link></Menu.Item>
        <Menu.Item>
          <Modal trigger={<Icon color={'blue'} name='search' />}>
            <Modal.Header>Search Songs</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <SearchSong />
              </Modal.Description>
            </Modal.Content>
          </Modal>
        </Menu.Item>
      </Menu.Menu>
    </Menu >
  );
};