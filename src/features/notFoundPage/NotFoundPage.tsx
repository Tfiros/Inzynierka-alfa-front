const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center pt-24 pb-12">
      <img
        src="
      /404.webp"
        alt="404"
        className="w-full max-w-sm block dark:hidden"
      />
      <img
        src="
      /404_dark.webp"
        alt="404"
        className="w-full max-w-sm hidden dark:block"
      />
    </div>
  )
}

export default NotFoundPage
