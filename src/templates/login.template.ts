import { wrapWithTemplate } from '../utils/templateUtils';

export default wrapWithTemplate(`
    <div id="auth">
        <h1>Login</h1>
        <form id="login-form">
            <label for="username">Username</label>
            <input type="text" id="username" name="username">
            
            <label for="password">Password</label>
            <input type="password" id="password" name="password">
            
            <button type="submit">Login</button>
        </form>
    </div>
`);
