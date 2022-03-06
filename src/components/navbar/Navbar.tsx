import React from 'react';
import { Button, Container, Navbar, NavbarBrand } from 'reactstrap';
import routes from './../../routes';
import getInstanceFirebase from './../../firebase/firebase';
import { clear } from '../../service/SessionStorage.service';
import LogoutIcon from './../../assets/img/icon/logout.svg';
const firebase = getInstanceFirebase();

function openSidebar(sidebarToggle: React.MutableRefObject<any>) {
	document.documentElement.classList.toggle('nav-open');
	sidebarToggle.current.classList.toggle('toggled');
}

function getBrand() {
	let brandName = 'Default Brand';
	routes.map((prop, key) => {
		if (window.location.href.indexOf(prop.layout || '' + prop.path) !== -1) {
			brandName = prop.name;
		}
		return null;
	});
	return brandName;
}
const logout = () => {
	firebase.logout();
	clear();
};

function NavbarComponent() {
	const sidebarToggleRef = React.useRef<any>();
	return (
		<Navbar
			color={'transparent'}
			expand='lg'
			className={'navbar-absolute fixed-top navbar-transparent'}
		>
			<Container fluid>
				<div className='navbar-wrapper'>
					<div className='navbar-toggle'>
						<button
							type='button'
							ref={sidebarToggleRef}
							className='navbar-toggler'
							onClick={() => openSidebar(sidebarToggleRef)}
						>
							<span className='navbar-toggler-bar bar1' />
							<span className='navbar-toggler-bar bar2' />
							<span className='navbar-toggler-bar bar3' />
						</button>
					</div>
					<NavbarBrand href='/'>{getBrand()}</NavbarBrand>
				</div>
				<Button
					className='btn-round'
					color='danger'
					type='submit'
					onClick={() => logout()}
				>
					<span>Log out &nbsp;&nbsp;&nbsp;</span>
					<span>
						<img className='icon-card-sm' src={LogoutIcon} alt='' />
					</span>
				</Button>
			</Container>
		</Navbar>
	);
}

export default NavbarComponent;
