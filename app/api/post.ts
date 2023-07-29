import OpenAI from 'openai'

const content = `
  You have the function defined and impleted, it will remove import from antd and add import from semi.
  const removeAntdImportAndAddSemiImport = (j, root, antdComponentName, semiCompomentName) => {
    // Find the import declaration for antd
    const antdImportDeclaration = root.find(j.ImportDeclaration, {
      source: {
        value: 'antd'
      }
    })

    // Find the named import specifiers
    const namedSpecifiers = antdImportDeclaration.find(j.ImportSpecifier)

    // Find the import specifier for antdComponent
    const antdComponentSpecifier = antdImportDeclaration.find(j.ImportSpecifier, {
      imported: {
        name: antdComponentName
      }
    })

    // Remove the antdComponent import specifier
    antdComponentSpecifier.remove()

    // Find the import declaration for semi-ui
    const semiUiImportDeclaration = root.find(j.ImportDeclaration, {
      source: {
        value: '@douyinfe/semi-ui'
      }
    })

    if (semiUiImportDeclaration.length) {
      // Add the Notification import specifier to semi-ui
      if (
        !semiUiImportDeclaration.find(j.ImportSpecifier, {
          imported: {
            name: semiCompomentName
          }
        }).length
      ) {
        semiUiImportDeclaration
          .get('specifiers')
          .push(j.importSpecifier(j.identifier(semiCompomentName)))
      }
    } else {
      // Add the Notification import specifier from semi-ui
      antdImportDeclaration.insertAfter(
        j.importDeclaration(
          [j.importSpecifier(j.identifier(semiCompomentName))],
          j.literal('@douyinfe/semi-ui')
        )
      )
    }

    // Remove the antd import
    if (antdComponentSpecifier.length && namedSpecifiers.length === 1) {
      antdImportDeclaration.remove()
    }
  }
  You can use it inside transformer code block, and just implete the rest code
`

export default function post(openai: OpenAI) {
  return async function POST(req: Request) {
    // Extract the `prompt` from the body of the request
    const formData = await req.formData()

    const originCode = formData.get('originCode')
    const newCode = formData.get('newCode')

    const prompt = `
      generate jscodeshift transform code that modify
      ${originCode}
      to
      ${newCode}.
      "
    `

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: prompt },
        // { role: 'system', content },
      ],
      temperature: 0,
      stream: true,
    })

    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        for await (const part of completion) {
          const content = part.choices[0].delta.content
          const _content = encoder.encode(content!)
          controller.enqueue(_content)
        }
      },
    })

    return new Response(stream, { status: 200 })
  }
}
