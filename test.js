import test from 'ava';
import sinon from 'sinon';
import sns from './fixtures/fake-sns';
import m from './';

const sandbox = sinon.sandbox.create();

test.before(() => {
	const stub = sandbox.stub(sns, 'publish');
	stub.withArgs({Message: 'foo', TopicArn: 'arn:aws:sns:us-west-2:111122223333:MyTopic'}).yields(undefined, {MessageId: 'foo'});
	stub.withArgs({Message: 'foo', TargetArn: 'arn:aws:sns:us-west-2:111122223333:GCM/MyTopic'}).yields(undefined, {MessageId: 'bar'});
	stub.withArgs({Message: 'foo', TopicArn: 'arn:aws:sns:us-west-2:111122223333:MyTopic', Subject: 'Hello World'}).yields(undefined, {MessageId: 'baz'});
	stub.yields(undefined, {MessageId: 'bla'});
});

test.after(() => {
	sandbox.restore();
});

test('error', t => {
	t.throws(m(), 'Please provide a message');
	t.throws(m('message'), 'Please provide an arn');
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

test.serial('object', async t => {
	await m({foo: 'bar'}, {arn: 'arn:aws:sns:us-west-2:111122223333:MyTopic'});

	t.same(sns.publish.lastCall.args[0], {
		Message: '{"foo":"bar"}',
		TopicArn: 'arn:aws:sns:us-west-2:111122223333:MyTopic'
	});
});

test.serial('json', async t => {
	await m({foo: 'bar'}, {arn: 'arn:aws:sns:us-west-2:111122223333:MyTopic', json: true});

	t.same(sns.publish.lastCall.args[0], {
		Message: {foo: 'bar'},
		TopicArn: 'arn:aws:sns:us-west-2:111122223333:MyTopic'
	});
});
