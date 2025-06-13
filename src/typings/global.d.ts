/**
 *  @author Remco Stoeten
 *  @description Provides global React type augmentations
 */
import * as React from 'react';

declare global {
	namespace React {
		/**
		 * Augments React's `PropsWithChildren` to ensure `children`
		 * is globally typed as `React.ReactNode | undefined`
		 */
		type PropsWithChildren<P = Record<string, unknown>> = {
			children?: React.ReactNode | undefined;
		} & P;
	}

	// Global type alias for children props
	type children = React.PropsWithChildren;
}
