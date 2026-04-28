type AlzuhaLogoProps = {
  lang: "ar" | "en";
  shellClassName?: string;
  imgClassName?: string;
};

export default function AlzuhaLogo({
  lang,
  shellClassName = "site-logo-shell",
  imgClassName = "site-logo-img",
}: AlzuhaLogoProps) {
  return (
    <div className={shellClassName}>
      <img
        src="/images/alzuha-logo.png"
        alt={lang === "ar" ? "شعار الزُهى" : "ALZUHA Logo"}
        className={imgClassName}
      />
    </div>
  );
}