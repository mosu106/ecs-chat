import Cookies from "universal-cookie";

export default ({ req, route, redirect }) => {
  console.log(route.path);

  const cookies = req ? new Cookies(req.headers.cookie) : new Cookies();
  const credential = cookies.get("user");

  // 認証済でログインページにアクセスしたらrootにリダイレクト
  if (credential && (route.path !== "/oekakichat" || route.path === "/" )) {
    return redirect("/oekakichat");
  }
  // 未認証でroot・ログインページ以外にアクセスしたらloginにリダイレクト
  if (!credential && route.path !== "/") {
    return redirect("/");
  }
};