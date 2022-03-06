import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firebase-firestore';
import FirebaseConfig from './firebaseConfig';

class Firebase {
	private auth: app.auth.Auth;
	private db: app.firestore.Firestore;
	static instance: Firebase;

	constructor() {
		app.initializeApp(FirebaseConfig);
		this.auth = app.auth();
		this.db = app.firestore();
		console.log('firebase initializeApp');
		console.log(this.auth.currentUser);
	}

	async login(email: string, password: string): Promise<app.auth.UserCredential> {
		await this.auth.setPersistence(app.auth.Auth.Persistence.SESSION);
		return this.auth.signInWithEmailAndPassword(email, password);
	}

	logout(): Promise<void> {
		return this.auth.signOut();
	}

	register(email: string, password: string): Promise<app.auth.UserCredential> {
		return this.auth.createUserWithEmailAndPassword(email, password);
	}

	isAuthorization(): boolean {
		return !!this.auth.currentUser;
	}

	getCurrentUser(): app.User | null {
		return this.auth.currentUser;
	}

	getUserDataByUid(uid: string) {
		return this.db.collection('users').where('uid', '==', uid).get();
	}

	watchStageChange(
		nextOrObserver: app.Observer<any, Error> | ((a: app.User | null) => any),
		error?: ((a: app.auth.Error) => any) | undefined,
		completed?: app.Unsubscribe | undefined,
	) {
		return this.auth.onAuthStateChanged(nextOrObserver, error, completed);
	}

	async checkVerifyAccount(uid: string) {
		if (!uid) return;
		const doc = await this.getUserDataByUid(uid);
		return !!doc.docs.length;
	}

	async setDocument(uid: string, data: Object) {
		const doc = await this.db.collection('users').where('uid', '==', uid).get();
		doc.docs.forEach(_doc => this.db.collection('users').doc(_doc.id).set(data));
	}

	async addDocumentUsers(data: Object) {
		return this.db.collection('users').add(data);
	}

	async getMqttByCode(code: string) {
		const doc = await this.db.collection('mqtt').where('code', '==', code).get();
		let result: any;

		doc.docs.forEach(_doc => {
			// console.log(_doc.data());
			result = _doc.data();
		});
		return result;
	}

	sendPasswordResetEmail(email: string) {
		return this.auth.sendPasswordResetEmail(email);
	}

	verifyEmail() {
		const user = this.getCurrentUser() as app.User;
		return user.sendEmailVerification();
	}

	isEmailVerified() {
		const sessionData = this.getUserSessionStorage();
		if (!sessionData) return;
		return sessionData['emailVerified'];
	}

	getUserSessionStorage() {
		const sessionData = sessionStorage.getItem(`firebase:authUser:${FirebaseConfig.apiKey}:[DEFAULT]`);
		return sessionData && JSON.parse(sessionData);
	}

	removeUserSessionStorage() {
		sessionStorage.removeItem(`firebase:authUser:${FirebaseConfig.apiKey}:[DEFAULT]`);
	}

	verifyPasswordResetCode(code: string) {
		return this.auth.verifyPasswordResetCode(code);
	}
	confirmPasswordReset(actionCode: string, newPassword: string) {
		return this.auth.confirmPasswordReset(actionCode, newPassword);
	}

	applyAction(code: string) {
		return this.auth.applyActionCode(code);
	}
}
export default function getInstanceFirebase() {
	if (!Firebase.instance) {
		Firebase.instance = new Firebase();
	}
	return Firebase.instance;
}
