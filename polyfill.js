// The @bugsnag/cuid package throws an error because it expects the environment to be browser-like.
navigator = navigator || { userAgent: '' };
