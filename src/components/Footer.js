import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  return (
    <footer>
      <div>
        <span className="ms-1">Copyright &copy; {currentYear} Hexaview Technologies. Inc.</span>
      </div>
    </footer>
  )
}

export default React.memo(Footer)
