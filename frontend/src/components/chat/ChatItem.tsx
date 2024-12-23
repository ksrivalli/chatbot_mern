import { Avatar, Box, Typography } from '@mui/material';
import { userAuth } from '../../context/AuthContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';;

function extractCodeFromString(message: string) {
    if(message.includes("```")) {
        const blocks = message.split("```");
        return blocks;
    }
}

function isCodeBlock(str: String) {
    if(str.includes("=") || str.includes(";") || str.includes("[") || str.includes("]") || str.includes("{")|| str.includes("}")|| str.includes("#")|| str.includes("//")) {
        return true;
    }
    return false;
}

const ChatItem = ({ content, role }: { content: string; role: "user" | "assistant" }) => {
  const messageBlocks = extractCodeFromString(content);
    const auth = userAuth();
  return role == "assistant" ? (
    <Box sx={{ display: 'flex', p: 2, bgcolor: '#004d5612', my: 2, gap: 2 }}>
      <Avatar sx={{ ml: 0 }}>
        <img src="/openai.png" alt="openai" width={"30px"} />
      </Avatar>
      <Box>
        {!messageBlocks && ( <Typography sx={{fontSize: "20px"}}>{content}</Typography> )}
        {messageBlocks && messageBlocks.length && messageBlocks.map((block, index) => 
  isCodeBlock(block) ? (
    <SyntaxHighlighter key={`code-block-${index}`} style={coldarkDark} language="javascript">
      {block}
    </SyntaxHighlighter>
  ) : (
    <Typography key={`text-block-${index}`} sx={{ fontSize: "20px" }}>
      {block}
    </Typography>
  )
)}
      </Box>
    </Box>
  ) : (
    <Box sx={{ display: 'flex', p: 2, bgcolor: '#004d56', gap: 2 , my: 2}}>
      <Avatar sx={{ ml: 0, bgcolor: 'black', color: 'white' }}>
        {auth?.user?.name[0]}
      </Avatar>
      <Typography sx={{ color: 'white', fontSize: '20px' }}>{content}</Typography>
    </Box>
  );
};

export default ChatItem;