import { PrivacyPolicyComponent } from "./../../privacy-policy/privacy-policy.component";
import { TermsOfServiceComponent } from "./../../terms-of-service/terms-of-service.component";
import { SentComponent } from "./../../sent/sent.component";
import { HomeComponent } from "../../components/home/home.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Required components for which route services to be activated
import { SignInComponent } from "../../components/sign-in/sign-in.component";
import { SignUpComponent } from "../../components/sign-up/sign-up.component";
import { DashboardComponent } from "../../components/dashboard/dashboard.component";
import { ForgotPasswordComponent } from "../../components/forgot-password/forgot-password.component";
import { VerifyEmailComponent } from "../../components/verify-email/verify-email.component";

// Import canActivate guard services
import { AuthGuard } from "../../shared/guard/auth.guard";
import { SecureInnerPagesGuard } from "../../shared/guard/secure-inner-pages.guard";

// Include route guard in routes array
const routes: Routes = [
  //{ path: '', redirectTo: '/sign-in', pathMatch: 'full'},
  {
    path: "privacy_policy",
    component: PrivacyPolicyComponent,
    canActivate: [SecureInnerPagesGuard],
  },
  {
    path: "terms_of_service",
    component: TermsOfServiceComponent,
    canActivate: [SecureInnerPagesGuard],
  },
  { path: "sent", component: SentComponent, canActivate: [AuthGuard] },
  { path: "", component: HomeComponent, canActivate: [SecureInnerPagesGuard] },
  {
    path: "sign-in",
    component: SignInComponent,
    canActivate: [SecureInnerPagesGuard],
  },
  {
    path: "register-user",
    component: SignUpComponent,
    canActivate: [SecureInnerPagesGuard],
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
    canActivate: [SecureInnerPagesGuard],
  },
  {
    path: "verify-email-address",
    component: VerifyEmailComponent,
    canActivate: [SecureInnerPagesGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
