import { Amplify } from 'aws-amplify';
import config from '../../amplify_outputs.json';

/**
 * Configure Amplify with the generated backend configuration
 * This must be called before any Amplify features are used
 */
export function configureAmplify() {
  Amplify.configure(config);
}
