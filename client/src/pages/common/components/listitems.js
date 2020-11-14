import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import BeenhereIcon from '@material-ui/icons/Beenhere';
import RoomIcon from '@material-ui/icons/Room';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { Link } from 'react-router-dom';


export const mainListItems = (
    <div>
        <ListItem
            component={Link}
            to='/add-places'>
            <ListItemIcon>
                <AddCircleOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="Add Visited Places" />
        </ListItem>
        <ListItem
            component={Link}
            to='/testsite'>
            <ListItemIcon>
                <RoomIcon />
            </ListItemIcon>
            <ListItemText primary="View Testing Sites" />
        </ListItem>
        <ListItem component={Link}
            to='/covid+locations'>
            <ListItemIcon>
                <BeenhereIcon />
            </ListItemIcon>
            <ListItemText primary="View Infected Places" />
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="View Test Results" />
        </ListItem>
    </div>
);

export const secondaryListItems = (
    <div>
        <ListSubheader inset></ListSubheader>
        <ListItem button>
            <ListItemIcon>
                {/* <AssignmentIcon /> */}
            </ListItemIcon>
            <ListItemText primary="" />
        </ListItem>

    </div>
);