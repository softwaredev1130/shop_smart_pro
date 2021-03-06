//TOP LEVEL IMPORTS
import React from 'react';
import { Link, browserHistory } from 'react-router';
//APOLLO
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { FETCH_MALLS } from '/imports/ui/apollo/queries'
import { CREATE_MALL } from '/imports/ui/apollo/mutations'

// ANTD
import Table from 'antd/lib/table';
import Button from 'antd/lib/button';
import Row from 'antd/lib/row';
// COMPONENTS
import { AddMallForm } from '../../components/common';


// CONSTANTS & DESTRUCTURING
// ==============================
const columns = [
	{
	  title: '_id',
	  dataIndex: '_id',
	  key: '_id',
	  //render: _id => <Link to={`/admin/users/${_id}`}>{_id}</Link>,
	},
	{
	  title: 'title',
	  dataIndex: 'title',
	  key: 'title'
	},
	{	
	  title: 'description',
	  dataIndex: 'description',
	  key: 'description'
	}
];


// INTERNAL COMPONENTS
// ==============================
class AdminMallsTable extends React.Component {
	render(){
		return (
			<Table
				rowKey={record => record._id}
				columns={columns}
				dataSource={this.props.malls}  
			/>
		);
	}
}


// EXPORTED COMPONENT
// ==============================
class AdminMalls extends React.Component {

	state = { visible: false, loadingSubmit: false, errors: [] }

	handleCancel = () => {
		this.setState({ visible: false });
	}
	showModal = () => {
		this.setState({ visible: true });
	}
	handleCreate = () => {
		const form = this.form;
		this.setState({loadingSubmit: true})
		form.validateFields((err, { title, description, street1, street2, country, state, postal, suburb, shopIds  }) => {
			if (err) { return this.setState({loadingSubmit: false}); }
			let variables = { title, description, street1, street2, country, state, postal, suburb, shopIds };
			this.props.mutate({ variables })
				.then(() => {
					this.props.data.refetch()
					form.resetFields();
					return this.setState({ visible: false, loadingSubmit: false });
				})
				.catch(e => {
					const errors = e.graphQLErrors.map( err => err.message );
					this.setState({ visible: false, loadingSubmit: false, errors });
					console.log('error ran');
					return console.log(errors);
			});

		});
	}
	saveFormRef = (form) => {
	this.form = form;
	}

	render(){
		const { loading, malls } = this.props.data;

		if (loading) { return <div>Loading...</div>; }

		return (
			<div>
				<Button type="primary" onClick={this.showModal}>+ Add Mall</Button>
				<AddMallForm
					ref={this.saveFormRef}
					visible={this.state.visible}
					onCancel={this.handleCancel}
					onCreate={this.handleCreate}
					loadingSubmit={this.state.loadingSubmit}
					{...this.props}
				/>
				<Row>
					<AdminMallsTable malls={malls} />
				</Row>
			</div>
		);
	}
}


// EXPORT
// ==============================
export default graphql(CREATE_MALL)(
	graphql(FETCH_MALLS)(AdminMalls)
);

