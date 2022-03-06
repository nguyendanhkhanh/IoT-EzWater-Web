import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav } from 'reactstrap';
import { IRouter } from '../../types/router.interface';

function activeRoute(props: any, routeName: string) {
	return props.location.pathname.indexOf(routeName) > -1 ? 'active' : '';
}

function Sidebar({
	bgColor,
	activeColor,
	routes,
	...props
}: {
	bgColor: string;
	activeColor: string;
	routes: IRouter[];
}) {
	return (
		<div className='sidebar' data-color={bgColor} data-active-color={activeColor}>
			<div className='logo text-center'>
				<NavLink to='/home' className='simple-text logo-normal'>
					EzWater
				</NavLink>
			</div>
			<div className='sidebar-wrapper'>
				<Nav>
					{routes.map((prop, key) => {
						return (
							<li className={activeRoute(props, prop.path)} key={key}>
								<NavLink to={prop.layout || '' + prop.path} className='nav-link' activeClassName='active'>
									<i className={prop.icon} />
									<p>{prop.name}</p>
								</NavLink>
							</li>
						);
					})}
				</Nav>
			</div>
		</div>
	);
}

export default Sidebar;
