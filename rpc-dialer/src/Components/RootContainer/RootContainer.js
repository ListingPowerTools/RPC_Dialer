import React, { useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme, fade, withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import LayersIcon from '@material-ui/icons/Layers';

import { Icon } from 'react-icons-kit';
import { users } from 'react-icons-kit/ikons/users';
import { socialBufferOutline } from 'react-icons-kit/ionicons/socialBufferOutline';
import { socialBuffer } from 'react-icons-kit/ionicons/socialBuffer';

import { Panel1, Panel2 } from '../AgentDesktopView/Panels';
import './styles.scss';

const drawerWidth = 240;
const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9 + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
});

class RootContainer extends React.Component {
  state = {
    anchorEl: null,
    open: false
  }

  handleProfileMenuOpen = event => {
    console.log('handleProfileOpen: ', event.currentTarget)
    this.setState({
      anchorEl: event.currentTarget
    })
  };

  handleMenuClose = () => {
    this.setState({
      anchorEl: null
    })
  };

  handleDrawerOpen = () => {
    this.setState({
      open: true
    })
  }

  handleDrawerClose = () => {
    this.setState({
      open: false
    })
  }

  render() {
    const { classes, theme } = this.props;

    const renderMenu = (
      <Menu
        anchorEl={this.state.anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id='primary-search-account-menu'
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={this.state.anchorEl === true ? true: false}
        onClose={this.handleMenuClose}
        style={{
          width: '200px',
          position: 'absolute',
          right: '0',
          top: '40px'
        }}
      >
        <MenuItem onClick={this.handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={this.handleMenuClose}>My account</MenuItem>
      </Menu>
    );

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: this.state.open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: this.state.open,
              })}
            >
              <MenuIcon />
            </IconButton>
            <div className="company-label">
              RPC Dialer
            </div>
            <IconButton
                aria-label="account of current user"
                aria-controls='primary-search-account-menu'
                aria-haspopup="true"
                onClick={this.handleProfileMenuOpen}
                color="inherit"
                style={{
                  position: 'absolute',
                  right: '0',
                  marginRight: '10px'
                }}
              >
                <AccountCircle />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: this.state.open,
            [classes.drawerClose]: !this.state.open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: this.state.open,
              [classes.drawerClose]: !this.state.open,
            }),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItem>
              <ListItem button key="Agent Desktop">
                <ListItemIcon><LayersIcon /></ListItemIcon>
                <ListItemText primary="Agent Desktop"/>
              </ListItem>
              <ListItem button key="Teams">
                <ListItemIcon><Icon icon={users}/></ListItemIcon>
                <ListItemText primary="Teams"/>
              </ListItem>
            </ListItem>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Panel1 socket={this.props.socket}/>
          <Panel2 />
        </main>
        {renderMenu}
      </div>
    );
  }
}

RootContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, {  withTheme: true })(RootContainer)