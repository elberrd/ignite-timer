import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    :focus{
        outline: 0;
        box-shadow: ${(propos) => propos.theme["gray-500"]};
    }

    body{
        background: ${(propos) => propos.theme["gray-900"]};
        color: ${(propos) => propos.theme["gray-300"]};
        -webkit-font-smoothing: antialiased;
    }
    
    body, input, button, textarea{
        font-family: "Roboto", sans-serif;
        font-weight: 400;
        font-size: 1rem;
    }
`;
