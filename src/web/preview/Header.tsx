function Header() {
  return (
    <div className="text-3xl text-center w-full bg-gray-500 text-white py-1 text-nowrap font-sans overflow-hidden">
      <a
        href="https://github.com/rurimegu/react-utils"
        target="_blank"
        rel="noreferrer"
      >
        <span className="hidden sm:inline">@rurino/react-utils</span>
        <span className="inline sm:hidden">Rurino</span>
      </a>{' '}
      Preview
      <span className="ml-2 text-base text-gray-300">{__APP_VERSION__}</span>
    </div>
  );
}

export default Header;
