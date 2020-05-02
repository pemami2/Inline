import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { createUrlResolverWithoutPackagePrefix } from '@angular/compiler';
import { FirebaseFirestore } from '@angular/fire';
import { AstTransformer } from '@angular/compiler/src/output/output_ast';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData: any; // Save logged in user data
  public customclaims$: Observable<any>;
  public user$: Observable<any>;
  userDoc: AngularFirestoreDocument<User>;
  public myTime: number;
  public partyTime: number;

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {

    this.user$ = this.afAuth.authState.pipe(switchMap(user => {
      if (user) {
        return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
      } else {
        return of(null)
      }
    }))
     //Saving user data in localstorage when
    // logged in and setting up null when logged out 
    this.user$.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });

    this.customclaims$ = this.afAuth.idTokenResult.pipe(filter(m =>  m && !!m.claims), map((t) => t.claims));

      this.myTime = Date.now();
      
      setInterval(() => {
        this.myTime = Date.now();  
      },60000);

    }

  // Sign in with email/password
  SignIn(email, password) {
    try {
      return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        if (result.user && !result.user.emailVerified) {
          this.afAuth.auth.signOut();
          throw new Error(`We have sent a confirmation email to ${email}.` +
          `\nPlease check your email and click on the link to verfiy your email address.`);
        } else if (this.localStorageEmailIsNotVerified && result.user && result.user.emailVerified) {
            // this is resetting the item with the latest claims (e.g. emailVerified)
            localStorage.setItem('user', JSON.stringify(result.user));
          }
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
        this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error.message);
      });

    } catch (error) {
      window.alert(error.message);
    }
  }

  // Sign up with email/password
  SignUp(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        this.SendVerificationMail();
        this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error.message);
      });
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification()
    .then(() => {
      this.router.navigate(['verify-email-address']);
    });
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail) {
    return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      window.alert('Password reset email sent, check your inbox.');
    }).catch((error) => {
      window.alert(error);
    });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log("isloggedin localstorage: ", user)
    console.log("isloggedin userData: ", this.userData)
    if (user !== null && user.phoneNumber !== null) { return true; }
    return (user !== null ) ? true : false;
  }

  get localStorageEmailIsNotVerified() {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified === false) ? true : false;
  }

  // Sign in with Google
  GoogleAuth() {
    console.log("google auth userData: ", this.userData)
    console.log("googleAuth localstorage: ", JSON.parse(localStorage.getItem('user')))
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }
  FacebookAuth() {
    return this.AuthLogin(new auth.FacebookAuthProvider());
  }

  // Auth logic to run auth providers
  async AuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
    .then((result) => {
      console.log("entered .then in authlogin, result:", result)
       this.ngZone.run(() => {
          console.log("entered .run in authlogin")
          setTimeout(() => {this.router.navigate(['dashboard']);}, 300);
        });
      this.SetUserData(result.user);
    }).catch((error) => {
      window.alert(error);
    });
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true
    });
  }

  SetUserDetails(uid, PIN, tables, message) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);
    const Details = {
      uid: uid,
      PIN: PIN,
      tables: tables,
      message: message
      

    };
    return userRef.set(Details, {
      merge: true
    });
  }
 


  SetArrayDetails(uid, tablearray) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);
    const Details = {
     tablearray: tablearray

    };
    return userRef.set(Details, {
      merge: true
    });
  }

  // Sign out
  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    });
  }

  // Sign with the phone number
  PhoneAuth(num: string, appVerifier: auth.ApplicationVerifier) {
    return this.afAuth.auth.signInWithPhoneNumber(num, appVerifier);
  }

  /*Readarray(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.get();
  }*/
}
