import { connect } from 'react-redux';
import { signup } from '../../actions/session_actions';
import SignUpForm from './SignUpForm';

const mapStateToProps = state => ({
  signedIn: state.session.isSignedIn,
  errors: state.errors.session
});

const mapDispatchToProps = dispatch => ({
  signup: user => dispatch(signup(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm);