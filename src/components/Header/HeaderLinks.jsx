/*eslint-disable*/
import React, { useEffect, useState } from 'react';
// react components for routing our app without refresh
import { Link } from 'gatsby';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Tooltip from '@material-ui/core/Tooltip';

// @material-ui/icons
import { Apps, CloudDownload, LocalGroceryStoreTwoTone } from '@material-ui/icons';

// React icons
import { FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';
import { FiTwitter } from 'react-icons/fi';

// core components
import CustomDropdown from 'components/CustomDropdown/CustomDropdown.jsx';
import Button from 'components/CustomButtons/Button.jsx';
import { AnchorLink } from 'gatsby-plugin-anchor-links';

import headerLinksStyle from 'assets/jss/material-kit-react/components/headerLinksStyle.jsx';
import el from 'date-fns/esm/locale/el/index.js';

function HeaderLinks({ ...props }) {
	const { classes, links } = props;

	const [count, setCount] = useState('');
    useEffect(() => {
    }, [count]);
    let changeWhenScrolling = () => {
        if (window.pageYOffset > 0 && window.pageYOffset < 764) {
            setCount('');
        }
        if (window.pageYOffset > 765 && window.pageYOffset < 1045) {
            setCount('/#why');
        }
        if (window.pageYOffset > 1046 && window.pageYOffset < 2239) {
            setCount('/#howto');
        }
        if (window.pageYOffset > 2238 && window.pageYOffset < 2885) {
            setCount('/#topup');
        }
    };
    window.addEventListener('scroll', changeWhenScrolling);

	return (
		<List className={classes.list}>
			{links.map((link, k) => (
				<ListItem className={classes.listItem} key={k}>
					<Tooltip
						id={link.id}
						title={link.title}
						placement={
							typeof window !== 'undefined' && window.innerWidth > 959
								? 'top'
								: 'left'
						}
						classes={{ tooltip: classes.tooltip }}
					>
						{link.target == '_anchor' ? (
							<AnchorLink
								to={link.href}
								title={link.title}
								className={classes.navLink}
							>
								<Button color='transparent' rel='noopener noreferrer'>
									{link.children}
								</Button>
							</AnchorLink>
						) : (
							<Button
								href={link.href}
								target={link.target}
								color='transparent'
								className={classes.navLink}
							>
								{link.children}
							</Button>
						)}
					</Tooltip>
					{link.href == count ? <div style={{borderBottom:'3px solid #038dda', width:'23px', position:'absolute', bottom:'5px', left:'27px'}}></div> : null}
				</ListItem>
			))}
			<ListItem
				className={classes.listItem}
				style={{ padding: 0, color: '#038dda' }}
			>
				<Tooltip
					id='instagram-tooltip'
					title='¡Síguenos en Instagram!'
					placement={
						typeof window !== 'undefined' && window.innerWidth > 959
							? 'top'
							: 'left'
					}
					classes={{ tooltip: classes.tooltip }}
				>
					<Button
						color='transparent'
						href='https://www.instagram.com/esunalivio'
						target='_blank'
						className={classes.navLink}
					>
						<FaInstagram />
					</Button>
				</Tooltip>
			</ListItem>
			<ListItem
				className={classes.listItem}
				style={{ padding: 0, margin: 0, color: '#038dda' }}
			>
				<Tooltip
					id='link-twitter'
					title='¡Síguenos en Twitter!'
					placement={
						typeof window !== 'undefined' && window.innerWidth > 959
							? 'top'
							: 'left'
					}
					classes={{ tooltip: classes.tooltip }}
				>
					<Button
						color='transparent'
						href='https://twitter.com/esunalivio'
						target='_blank'
						className={classes.navLink}
					>
						<FiTwitter />
					</Button>
				</Tooltip>
			</ListItem>
			<Button className={classes.buttonRecargaYa}>Recarga Ya</Button>
		</List>
	);
}

export default withStyles(headerLinksStyle)(HeaderLinks);
