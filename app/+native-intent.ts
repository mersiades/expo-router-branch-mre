import branch, {BranchParams} from 'react-native-branch';

const getBranchPathname = ({
                               branchParams,
                           }: {
    branchParams: BranchParams;
}): string => {
    const pathname = branchParams['$deeplink_path'];

    if (pathname) {
        if (typeof pathname === 'string') {
            return pathname;
        } else {
            return '/';
        }
    } else {
        return '/';
    }
};

export const redirectSystemPath = async ({
                                             path,
    initial
                                         }: {
    path: string;
    // AFAIK, initial is true if link is tapped while app is closed;
    // initial is false if link is tapped while app is in background
    initial: boolean
}) => {
    console.log('initial', initial);
    let url;

    try {
        url = new URL(path);

        if (url.protocol === 'https:' && url.hostname.includes('app.link')) {
            // There's no way to reset first params apart from deleting the app from the device
            const firstParams = await branch.getFirstReferringParams();
            console.log('firstParams', firstParams);

            // if (Object.keys(firstParams).length > 0) {
            //     const pathname = getBranchPathname({
            //         branchParams: firstParams,
            //     });
            //     console.log('redirectSystemPath pathname from first params', pathname);
            //     return pathname
            // }

            const branchParams = await branch.getLatestReferringParams();

            if (Object.keys(branchParams).length === 0) {
                // Nav to not found screen for visual debug in release build
                return "/no-branch-params";
            }

            if (!branchParams['+clicked_branch_link']) {
                // Nav to not found screen for visual debug in release build
                return "/not-clicked";
            }

            if (!branchParams['$deeplink_path']) {
                // Nav to not found screen for visual debug in release build
                return "/no-deeplink";
            }

            const pathname = getBranchPathname({
                branchParams,
            });

            console.log('redirectSystemPath pathname from recent params', pathname);

            return pathname;
        }
    } catch (e) {
        console.info(e);
        // We'll hit this catch clause if the path is not prepended with a schema
        // (https://, chatloop://), so just pass it through as a regular path
        // Usually, this is when Detox is opening the app with a URL like
        // [TypeError: Invalid URL: /reset-password?token=junk-token]
        return path;
    }

    return path;
};
