import {
  KageLandingPage,
  type LandingPageProps,
} from "../../src/shaders/landing-pages/LandingPages";
import type { PageTypographyProps } from "../../src/shaders/landing-pages/pageTypography";

export type KageLandingPageProps = LandingPageProps & PageTypographyProps;

export { KageLandingPage };
export default KageLandingPage;
