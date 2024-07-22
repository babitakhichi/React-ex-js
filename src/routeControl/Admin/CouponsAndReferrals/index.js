const accessRoute = {
  COUPONS_AND_REFERRALS: {
    path: "/admin",
    icon: (
      <span className="nk-menu-icon">
        <em className="icon ni ni-tags" />
      </span>
    ),
  },
  COUPONS: {
    path: "/admin/coupons"
  },
  REFERRALS: {
    path: "/admin/referrals"
  },
  COUPONS_HISTORY: {
    path: "/admin/history"
  },
  CREATE_COUPONS: {
    path: "/admin/create"
  },
};

export default accessRoute;
