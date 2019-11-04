import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import FetchingExample from '../containers/FetchingExample';
import Grid from '@material-ui/core/Grid';

const IndexPage = () => (
  <Layout>
    
    <FetchingExample />
  </Layout>
)

export default IndexPage
