import { CodeEditer } from './Code'
import Form from './Form'

export default function Home() {
  const apiPath =
    process.env.NODE_ENV === 'development' ? '/api/chat-dev' : '/api/chat'
  return (
    <Form apiPath={apiPath}>
      <div className="flex flex-1 flex-col gap-8">
        <CodeEditer
          name="originCode"
          title="Origin Code"
          defaultCode={`import { Divider, Button } from 'antd'

<Divider type="vertical" />`}
        />
        <CodeEditer
          name="newCode"
          title="New Code"
          defaultCode={`import { Button } from 'antd'
import { Divider } from '@douyinfe/semi-ui'

<Divider layout="vertical" />`}
        />
      </div>
    </Form>
  )
}
