
import React, { useState } from 'react';
import { useMatch } from 'react-location';

import { IconButton } from '../../components/buttons/IconButton/IconButton';
import SvgAdd from '../../components/icons/actions/Add';
import { Content, Layout, Row } from '../../components/Layout/Layout';
import Modal from '../../components/Modal/Modal';
import { RelativeElements } from '../../components/RelativeElements/RelativeElements';
import { Toolbox } from '../../components/RelativeElements/Toolbox';
import { useAccounts } from '../../core/api/account';
import AddAccountForm from '../../modules/Account/forms/AddAccountForm/AddAccountForm';
import { LocationGenerics } from '../../routes';
import AccountButton from './components/AccountButtons';

function AccountsPage (): React.ReactElement {
  const { data: { accounts } } = useMatch<LocationGenerics>();
  const [isOpen, setIsOpen] = useState(false);

  const { data } = useAccounts();

  const renderAccounts = data?.map((account) => (
    <AccountButton
      account={account}
      key={account.id}
    />
  ));

  const renderActions = (
    <IconButton
      icon={<SvgAdd />}
      onClick={() => setIsOpen(true)}
    />
  );

  return (
    <>
      <Layout>
        <Content>
          <Row>
            {accounts ? renderAccounts : null}
          </Row>
        </Content>
      </Layout>
      <RelativeElements>
        <Toolbox>
          {renderActions}
        </Toolbox>
        <Modal
          formId='add-account'
          handleClose={() => setIsOpen(false)}
          isOpen={isOpen}
          title='Add Account'
        >
          <AddAccountForm handleClose={() => setIsOpen(false)} />
        </Modal>
      </RelativeElements>
    </>
  );
}

export default AccountsPage;
