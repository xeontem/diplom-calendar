import React from 'react';
import { Link } from 'react-router-dom';
import FontIcon from 'react-md/lib/FontIcons';
import ListItem from 'react-md/lib/Lists/ListItem';

let selectLink = (link) => {
        if(link === window.location.pathname) return true;
        return false;
    }

export default [
  <Link id="link1" className={selectLink('/month') && 'active'} key="000" to="/month"><ListItem leftIcon={<FontIcon>date_range</FontIcon>} primaryText="Month" /></Link>,
  <Link id="link2" className={selectLink('/week') && 'active'} key="001" to="/week"><ListItem leftIcon={<FontIcon>event</FontIcon>} primaryText="Week" /></Link>,
  <Link id="link3" className={selectLink('/day') && 'active'} key="002" to="/day"><ListItem leftIcon={<FontIcon>content_paste</FontIcon>} primaryText="Day" /></Link>,
  <Link id="link4" className={selectLink('/table') && 'active'} key="003" to="/table"><ListItem leftIcon={<FontIcon>list</FontIcon>} primaryText="Table" /></Link>,
  <Link id="link5" className={selectLink('/agenda') && 'active'} key="004" to="/agenda"><ListItem leftIcon={<FontIcon>view_agenda</FontIcon>} primaryText="Agenda" /></Link>,
  { key: 'divider', divider: true }
];
