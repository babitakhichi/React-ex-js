import { baseRoutes } from "../../../helpers/baseRoutes";

const accessRoute = {
  VIDEO_CONFERENCING: {
    path: `${baseRoutes.userBaseRoutes}video-conferencing`,
  },
  JITSI_MEET: {
    path: `${baseRoutes.userBaseRoutes}meeting`,
  },
  JITSI_INVITEE: {
    path: `${baseRoutes.userBaseRoutes}invitee`,
  },
  UNREGISTER_JITSI_MEET: {
    path: `${baseRoutes.userBaseRoutes}user-meeting`,
  },
  UNREGISTER_INVITEE: {
    path: `${baseRoutes.userBaseRoutes}user-invitee`,
  },
};

export default accessRoute;
