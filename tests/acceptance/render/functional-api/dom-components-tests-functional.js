import get from '../../../tools/get';
import Inferno from '../../../../src';

export default function domComponentsTestsFunctional(describe, expect, container) {

	class BasicComponent1 extends Inferno.Component {
		template(createElement, createComponent, name, title) {
			return createElement("div", {className: "basic"},
				createElement("span", {className: name}, "The title is ", title)
			);
		}
		render() {
			return Inferno.createFragment([this.props.name, this.props.title], this.template);
		}
	}

	describe('should render a basic component', () => {
		let template;

		beforeEach(() => {
			template = Inferno.createTemplate((createElement, createComponent, Component) =>
				createElement('div', null,
					createComponent(Component)
				)
			);
			Inferno.render(Inferno.createFragment([
				{component: BasicComponent1, props: {title: "abc", name: "basic-render"}}
			], template), container);
		});

		it('Initial render (creation)', () => {
			expect(
				container.innerHTML
			).to.equal(
				'<div><div class="basic"><span class="basic-render">The title is abc</span></div></div>'
			);
		});
		it('Second render (update)', () => {
			Inferno.render(Inferno.createFragment([
				{component: BasicComponent1, props: {title: "123", name: "basic-update"}}
			], template), container);
			expect(
				container.innerHTML
			).to.equal(
				'<div><div class="basic"><span class="basic-update">The title is 123</span></div></div>'
			);
		});
	});

	describe('should render a basic root component', () => {
		let template;

		beforeEach(() => {
			template = Inferno.createTemplate((createElement, createComponent, Component) =>
				createComponent(Component)
			);
			Inferno.render(Inferno.createFragment([
				{component: BasicComponent1, props: {title: "abc", name: "basic-render"}}
			], template), container);
		});

		it('Initial render (creation)', () => {
			expect(
				container.innerHTML
			).to.equal(
				'<div class="basic"><span class="basic-render">The title is abc</span></div>'
			);
		});
		it('Second render (update)', () => {
			Inferno.render(Inferno.createFragment([
				{component: BasicComponent1, props: {title: "123", name: "basic-update"}}
			], template), container);
			expect(
				container.innerHTML
			).to.equal(
				'<div class="basic"><span class="basic-update">The title is 123</span></div>'
			);
		});
	});

	class BasicComponent2 extends Inferno.Component {
		template(createElement, createComponent, name, title, children) {
			return createElement("div", {className: "basic"},
				createElement("span", {className: name}, "The title is ", title),
				children
			);
		}
		render() {
			return Inferno.createFragment([this.props.name, this.props.title, this.props.children], this.template);
		}
	}

	describe('should render a basic component with children', () => {
		let template;

		beforeEach(() => {
			template = Inferno.createTemplate((createElement, createComponent, Component) => {
				createElement('div', null,
					createComponent(Component,
						createElement('span', null, 'I\'m a child')
					)
				)
			});

			Inferno.render(
				Inferno.createFragment([{ component: BasicComponent2, props: {title: "abc", name: "basic-render"} }], template), container
			);
		});

		it('Initial render (creation)', () => {
			expect(
				container.innerHTML
			).to.equal(
				'<div><div class="basic"><span class="basic-render">The title is abc</span><span>I\'m a child</span></div></div>'
			);
		});
		it('Second render (update)', () => {
			Inferno.render(
				Inferno.createFragment([{ component: BasicComponent2, props: {title: "123", name: "basic-update"} }], template), container
			);
			expect(
				container.innerHTML
			).to.equal(
				'<div><div class="basic"><span class="basic-update">The title is 123</span><span>I\'m a child</span></div></div>'
			);
		});
	});

	describe('should render multiple components', () => {
		let template;

		beforeEach(() => {
			template = Inferno.createTemplate((createElement, createComponent, Component, Component2) =>
				createElement('div', null,
					createComponent(Component),
					createComponent(Component2)
				)
			);
			Inferno.render(Inferno.createFragment([
				{component: BasicComponent1, props: {title: "component 1", name: "basic-render"}},
				{component: BasicComponent1, props: {title: "component 2", name: "basic-render"}}
			], template), container);
		});

		it('Initial render (creation)', () => {
			expect(
				container.innerHTML
			).to.equal(
				'<div><div class="basic"><span class="basic-render">The title is component 1</span></div>'
				+ '<div class="basic"><span class="basic-render">The title is component 2</span></div></div>'
			);
		});

		it('Second render (update)', () => {
			Inferno.render(Inferno.createFragment([
				{component: BasicComponent1, props: {title: "component 1", name: "basic-render"}},
				null
			], template), container);
			expect(
				container.innerHTML
			).to.equal(
				'<div><div class="basic"><span class="basic-render">The title is component 1</span></div></div>'
			);
		});
	});

	class BasicComponent3 extends Inferno.Component {
		template(createElement, createComponent, styles, title) {
			return createElement("div", {style: styles},
				createElement("span", {style: styles}, "The title is ", title)
			);
		}
		render() {
			return Inferno.createFragment([this.props.styles, this.props.title], this.template);
		}
	}

	describe('should render a basic component with styling', () => {
		let template;

		beforeEach(() => {
			template = Inferno.createTemplate((createElement, createComponent, Component) =>
				createComponent(Component)
			);
			Inferno.render(Inferno.createFragment([
				{component: BasicComponent3, props: {title: "styled!", styles: { color: "red", padding: 10}}}
			], template), container);
		});

		it('Initial render (creation)', () => {
			expect(
				container.innerHTML
			).to.equal(
				'<div style="color: red; padding: 10px;"><span style="color: red; padding: 10px;">The title is styled!</span></div>'
			);
		});
		it('Second render (update)', () => {
			Inferno.render(Inferno.createFragment([
				{component: BasicComponent3, props: {title: "styled (again)!", styles: { color: "blue", margin: 20}}}
			], template), container);
			expect(
				container.innerHTML
			).to.equal(
				'<div style="color: blue; margin: 20px;"><span style="color: red; padding: 10px;">The title is styled (again)!</span></div>'
			);
		});
	});

	class TestComponent extends Inferno.Component {
		template(t, c, value, styles) {
			return t('select', {
						multiple: true,
						value: value,
						style: styles
					},
					t('optgroup', {
						label: 'foo-group'
					}, t('option', {
						value: 'foo'
					}, 'Im a li-tag')),
					t('optgroup', {
						label: 'bar-group'
					}, t('option', {
						value: 'bar'
					}, 'Im a li-tag')),
					t('optgroup', {
						label: 'dominic-group'
					}, t('option', {
						value: 'dominic'
					}, 'Im a li-tag'))
			);
		}
		render() {
			return Inferno.createFragment([this.props.value, this.props.style], this.template);
		}
	}

	describe('should render a basic test component', () => {
		let template;

		beforeEach(() => {
			template = Inferno.createTemplate((createElement, createComponent, Component) =>
				createElement('div', null,
					createComponent(Component)
				)
			);
			Inferno.render(Inferno.createFragment([{
				component: TestComponent,
				props: {
					value: ['bar', 'dominic'],
					style: { background: 'red' }
				}
			}], template), container);
		});

		it('Initial render (creation)', () => {
			expect(
				container.innerHTML
			).to.equal(
				'<div><select multiple="" style="background: red;"><optgroup label="foo-group">'
				+ '<option value="foo">Im a li-tag</option></optgroup><optgroup label="bar-group">'
				+ '<option value="bar">Im a li-tag</option></optgroup><optgroup label="dominic-group">'
				+ '<option value="dominic">Im a li-tag</option></optgroup></select></div>'
			);
		});
		it('Second render (update)', () => {
			Inferno.render(Inferno.createFragment([{
				component: TestComponent,
				props: {
					value: ['bar', 'dominic'],
					style: { background: 'red' }
				}
			}], template), container);
			expect(
				container.innerHTML
			).to.equal(
				'<div><select multiple="" style="background: red;"><optgroup label="foo-group">'
				+ '<option value="foo">Im a li-tag</option></optgroup><optgroup label="bar-group">'
				+ '<option value="bar">Im a li-tag</option></optgroup><optgroup label="dominic-group">'
				+ '<option value="dominic">Im a li-tag</option></optgroup></select></div>'
			);
		});
	});
}
