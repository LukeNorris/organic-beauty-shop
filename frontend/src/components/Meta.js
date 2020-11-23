import React from 'react'
import { Helmet } from 'react-helmet'

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  )
}

Meta.defaultProps = {
    title: 'Welcome to Organic Beauty',
    keywords: 'organics, beauty, cosmetics, skin care',
    description: 'We sell beauty products that have been produced ethically using organic ingredients'
}

export default Meta