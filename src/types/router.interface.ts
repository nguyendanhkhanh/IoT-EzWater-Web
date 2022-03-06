export interface IRouter {
	path: string;
	name: string;
	icon: string;
	component: (props: any) => JSX.Element;
	layout?: string;
}
