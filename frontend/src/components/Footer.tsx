export function Footer() {
  return (
    <footer className="border-t border-rule px-6 pt-24 pb-10 md:px-10">
      <div className="mx-auto max-w-[1440px]">
        <p lang="hi" className="font-indic text-[clamp(3.5rem,14vw,13rem)] leading-[1.1] tracking-[-0.02em] text-paper/90">
          लिपि
        </p>
        <div className="mt-12 flex flex-col justify-between gap-6 border-t border-rule pt-6 text-sm text-muted md:flex-row">
          <p>B.Tech project. Model and data by AI4Bharat (MIT licence).</p>
          <ul className="flex flex-wrap gap-6">
            <li><a className="wipe-link hover:text-paper" href="https://github.com/sahilmeenameena001-boop/Btech-project">Repository</a></li>
            <li><a className="wipe-link hover:text-paper" href="https://arxiv.org/abs/2205.03018">Paper</a></li>
            <li><a className="wipe-link hover:text-paper" href="https://github.com/AI4Bharat/IndicXlit">IndicXlit</a></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
