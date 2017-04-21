import test from 'ava';
import sns from './fixtures/stub-sns';
import m from './';

test('error', async t => {
	await t.throws(m(), 'Please provide a message');
	await t.throws(m('message'), 'Please provide an `arn` or a `phone` number');
	await t.throws(m('message', {phone: '021'}), 'Provided number `021` is not a valid E. 164 phone number');
});

test('topic', async t => {
	t.is(await m('foo', {arn: 'arn:aws:sns:us-west-2:111122223333:MyTopic'}), 'foo');
});

test('application', async t => {
	t.is(await m('foo', {arn: 'arn:aws:sns:us-west-2:111122223333:GCM/MyTopic'}), 'bar');
});

test('subject', async t => {
	t.is(await m('foo', {arn: 'arn:aws:sns:us-west-2:111122223333:MyTopic', subject: 'Hello World'}), 'baz');
});

test('phone number', async t => {
	t.is(await m('foo', {phone: '+14155552671'}), 'phone');
});

test('phone number and topic', async t => {
	t.is(await m('foo', {phone: '+14155552671', arn: 'arn:aws:sns:us-west-2:111122223333:MyTopic'}), 'phonearn');
});

test.serial('object', async t => {
	await m({foo: 'bar'}, {arn: 'arn:aws:sns:us-west-2:111122223333:MyTopic'});

	t.deepEqual(sns.publish.lastCall.args[0], {
		Message: '{"foo":"bar"}',
		TopicArn: 'arn:aws:sns:us-west-2:111122223333:MyTopic'
	});
});

test.serial('json', async t => {
	await m({foo: 'bar'}, {arn: 'arn:aws:sns:us-west-2:111122223333:MyTopic', json: true});

	t.deepEqual(sns.publish.lastCall.args[0], {
		Message: {foo: 'bar'},
		TopicArn: 'arn:aws:sns:us-west-2:111122223333:MyTopic'
	});
});

test.serial('phone, topic and subject', async t => {
	await m({foo: 'bar'}, {phone: '+14155552671', arn: 'arn:aws:sns:us-west-2:111122223333:MyTopic', subject: 'MySubject', json: true});

	t.deepEqual(sns.publish.lastCall.args[0], {
		Message: {foo: 'bar'},
		TopicArn: 'arn:aws:sns:us-west-2:111122223333:MyTopic',
		PhoneNumber: '+14155552671',
		Subject: 'MySubject'
	});
});
