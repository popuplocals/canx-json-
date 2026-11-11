/** No page-transition curtain: the owner wants pages to open without any reveal animation. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
