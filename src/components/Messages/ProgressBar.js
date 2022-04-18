import React from 'react'
import { Progress } from 'semantic-ui-react'

const ProgressBar =({uploadState , percentUploaded})=>(
        uploadState==='uploading' && (
            <Progress
                inverted
                className='progress__bar'
                percent={percentUploaded}
                indicating
                progress
                size='medium'
            />
        )
    )

export default ProgressBar
